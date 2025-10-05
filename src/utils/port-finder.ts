import { createServer } from 'net';

/**
 * Checks if a port is available on the given host
 * @param port Port number to check
 * @param host Host to check (default: '0.0.0.0')
 * @returns Promise<boolean> true if port is available, false otherwise
 */
async function isPortAvailable(port: number, host: string = '0.0.0.0'): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port, host);
  });
}

/**
 * Finds an available port starting from the preferred port
 * @param preferredPort The port to try first
 * @param host Host to bind to (default: '0.0.0.0')
 * @param maxAttempts Maximum number of ports to try (default: 10)
 * @returns Promise<number> The first available port found
 * @throws Error if no available port is found within maxAttempts
 */
export async function findAvailablePort(
  preferredPort: number,
  host: string = '0.0.0.0',
  maxAttempts: number = 10
): Promise<number> {
  for (let i = 0; i < maxAttempts; i++) {
    const portToTry = preferredPort + i;
    
    if (await isPortAvailable(portToTry, host)) {
      if (i > 0) {
        console.log(`Port ${preferredPort} was in use, using port ${portToTry} instead`);
      }
      return portToTry;
    }
  }
  
  throw new Error(
    `Could not find an available port after trying ${maxAttempts} ports starting from ${preferredPort}`
  );
}
