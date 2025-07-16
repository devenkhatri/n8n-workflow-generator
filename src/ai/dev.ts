import { config } from 'dotenv';
config();

import '@/ai/flows/generate-workflow-from-description.ts';
import '@/ai/flows/handle-uninterpretable-input.ts';