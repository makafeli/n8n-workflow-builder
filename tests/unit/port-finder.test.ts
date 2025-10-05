import { findAvailablePort } from '../../src/utils/port-finder';
import { createServer } from 'net';

describe('port-finder', () => {
  let blockingServers: any[] = [];

  afterEach(async () => {
    // Close all blocking servers
    await Promise.all(
      blockingServers.map(
        server =>
          new Promise<void>(resolve => {
            server.close(() => resolve());
          })
      )
    );
    blockingServers = [];
  });

  describe('findAvailablePort', () => {
    it('should return the preferred port when available', async () => {
      const port = await findAvailablePort(9876);
      expect(port).toBe(9876);
    });

    it('should find the next available port when preferred port is in use', async () => {
      // Block port 9877
      const blockingServer = createServer();
      await new Promise<void>(resolve => {
        blockingServer.listen(9877, '0.0.0.0', () => resolve());
      });
      blockingServers.push(blockingServer);

      // Should return 9878 (next available port)
      const port = await findAvailablePort(9877);
      expect(port).toBe(9878);
    });

    it('should skip multiple occupied ports', async () => {
      // Block ports 9879, 9880, 9881
      for (let i = 0; i < 3; i++) {
        const blockingServer = createServer();
        await new Promise<void>(resolve => {
          blockingServer.listen(9879 + i, '0.0.0.0', () => resolve());
        });
        blockingServers.push(blockingServer);
      }

      // Should return 9882 (first available after 9879, 9880, 9881)
      const port = await findAvailablePort(9879);
      expect(port).toBe(9882);
    });

    it('should throw error when no available port found within maxAttempts', async () => {
      // Block ports 9883 to 9885 (3 ports)
      for (let i = 0; i < 3; i++) {
        const blockingServer = createServer();
        await new Promise<void>(resolve => {
          blockingServer.listen(9883 + i, '0.0.0.0', () => resolve());
        });
        blockingServers.push(blockingServer);
      }

      // Try with maxAttempts=3, should fail
      await expect(findAvailablePort(9883, '0.0.0.0', 3)).rejects.toThrow(
        'Could not find an available port after trying 3 ports starting from 9883'
      );
    });

    it('should respect custom maxAttempts parameter', async () => {
      // Block port 9886
      const blockingServer = createServer();
      await new Promise<void>(resolve => {
        blockingServer.listen(9886, '0.0.0.0', () => resolve());
      });
      blockingServers.push(blockingServer);

      // Should work with maxAttempts=2
      const port = await findAvailablePort(9886, '0.0.0.0', 2);
      expect(port).toBe(9887);
    });
  });
});
