const { spawn } = require('child_process');
const os = require('os');

function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const addr of iface) {
        if (addr.family === 'IPv4' && !addr.internal && !addr.address.startsWith('127.')) {
          if (addr.address.startsWith('192.168') || addr.address.startsWith('10.') || addr.address.startsWith('172.')) {
            return addr.address;
          }
        }
      }
    }
  }
  return 'localhost';
}

const ip = getNetworkIP();
console.log(`\n🌐 Network IP: ${ip}\n`);

const child = spawn('next', ['dev'], {
  stdio: ['inherit', 'pipe', 'pipe']
});

// Çıktıyı oku ve 127.x.x.x'i gerçek IP ile değiştir
child.stdout.on('data', (data) => {
  const output = data.toString().replace(/127\.\d+\.\d+\.\d+/g, ip);
  process.stdout.write(output);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

child.on('exit', (code) => process.exit(code || 0));
