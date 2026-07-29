'use strict';

const GENERATIONS_URL = 'https://cloud.leonardo.ai/api/rest/v1/generations';
const DEFAULT_POLL_INTERVAL_MS = 2000;
const DEFAULT_MAX_POLL_ATTEMPTS = 30;

// ---------------------------------------------------------------------------
// Prompt building — the whole brief section (Palette/Subject-Scene/Key
// visual elements/Composition) goes straight into the prompt, so every one
// of the 18 cards in design/cards/art-briefs.md yields a distinct,
// brief-specific prompt rather than a generic template.
// ---------------------------------------------------------------------------

function buildPrompt({ cardName, brief }) {
  return `Trading card illustration for "${cardName}". ${brief}`.trim();
}

function generationStatusUrl(generationId) {
  return `${GENERATIONS_URL}/${generationId}`;
}

async function readJson(response, context) {
  if (!response.ok) {
    const body = typeof response.text === 'function' ? await response.text().catch(() => '') : '';
    throw new Error(
      `Leonardo API request failed (${context}): ${response.status || ''} ${response.statusText || ''} ${body}`.trim()
    );
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// createLeonardoArtClient — the real, opt-in art-generation client behind
// the same generateArt({ cardName, brief }) -> Promise<{ href }> seam the
// mock client implements in tools/composite-card-art.js.
//
// fetchImpl/sleepImpl are injectable so tests never make a real network
// call or wait on a real timer.
// ---------------------------------------------------------------------------

function createLeonardoArtClient({
  fetchImpl = fetch,
  sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
  maxPollAttempts = DEFAULT_MAX_POLL_ATTEMPTS,
} = {}) {
  const apiKey = process.env.LEONARDO_API_KEY;
  if (!apiKey) {
    throw new Error(
      'LEONARDO_API_KEY environment variable is required to run tools/composite-card-art.js --live'
    );
  }

  return {
    async generateArt({ cardName, brief }) {
      const prompt = buildPrompt({ cardName, brief });

      const createResponse = await fetchImpl(GENERATIONS_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        // LEONARDO_MODEL_ID pins the generation model (e.g. Phoenix 1.0
        // de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3); unset falls back to the
        // account's platform default, which produced flat abstract textures
        // for these briefs.
        body: JSON.stringify({
          prompt,
          num_images: 1,
          width: 1024,
          height: 616,
          ...(process.env.LEONARDO_MODEL_ID ? { modelId: process.env.LEONARDO_MODEL_ID } : {}),
        }),
      });
      const created = await readJson(createResponse, `creating generation for "${cardName}"`);
      const generationId = created && created.sdGenerationJob && created.sdGenerationJob.generationId;
      if (!generationId) {
        throw new Error(
          `Leonardo API did not return a generationId for "${cardName}": ${JSON.stringify(created)}`
        );
      }

      for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
        const statusResponse = await fetchImpl(generationStatusUrl(generationId), {
          method: 'GET',
          headers: { accept: 'application/json', authorization: `Bearer ${apiKey}` },
        });
        const statusBody = await readJson(statusResponse, `polling generation "${generationId}" for "${cardName}"`);
        const generation = statusBody && statusBody.generations_by_pk;

        if (generation && generation.status === 'COMPLETE') {
          const image = generation.generated_images && generation.generated_images[0];
          if (!image || !image.url) {
            throw new Error(`Leonardo generation "${generationId}" completed with no image URL for "${cardName}"`);
          }
          return { href: image.url };
        }
        if (generation && generation.status === 'FAILED') {
          throw new Error(`Leonardo generation "${generationId}" failed for "${cardName}"`);
        }
        await sleepImpl(pollIntervalMs);
      }
      throw new Error(
        `Leonardo generation "${generationId}" for "${cardName}" did not complete after ${maxPollAttempts} polls`
      );
    },
  };
}

module.exports = { createLeonardoArtClient, buildPrompt };
