import fs from 'fs';
import readline from 'readline';

const logPath = 'C:\\Users\\mahav\\.gemini\\antigravity\\brain\\c1d158a9-ca03-463d-8e2a-0ea784b4294a\\.system_generated\\logs\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const step = JSON.parse(line);
    if (step.source === 'USER_EXPLICIT' || step.type === 'USER_INPUT') {
      console.log(`\n--- STEP ${step.step_index} ---`);
      console.log(step.content || '(empty content)');
    }
  } catch (e) {
    // ignore parsing errors
  }
});
