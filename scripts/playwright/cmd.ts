import * as http from 'http';

const PORT = 9222;

async function sendCommand(cmd: string, args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ cmd, args });
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result);
          }
        } catch {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const [, , cmd, ...args] = process.argv;

  if (!cmd) {
    console.log('Usage: cmd.ts <command> [args...]');
    console.log('Commands: navigate, fill, click, screenshot, wait, waitfor, text, url, evaluate, scroll, stop');
    process.exit(1);
  }

  try {
    const result = await sendCommand(cmd, args);
    console.log(JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
