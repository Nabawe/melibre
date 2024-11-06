/*
    - depth             = How deep you want to nest.
    - branching factor  = How many entries each Map will have.

    - Each Map object has overhead (approximately 24 bytes)
    - Each entry (key-value pair) has overhead (approximately 24 bytes)
    - Numbers in JavaScript are 64-bit (8 bytes)
    - The actual limit depends on:
        - Available system memory
        - JavaScript engine implementation
        - Garbage collection behavior
        - Other running processes
*/

// Memory calculator for nested maps
function calculateMapMemoryUsage(depth, branchingFactor) {
    const NUMBER_SIZE = 8;  // 64-bit number = 8 bytes
    const MAP_OVERHEAD = 24; // Approximate overhead per Map object
    const ENTRY_OVERHEAD = 24; // Approximate overhead per Map entry

    function calculateNodesAtLevel(level) {
        return Math.pow(branchingFactor, level);
    }

    let totalMemory = 0;
    let totalNodes = 0;

    for (let level = 0; level < depth; level++) {
        const nodesAtLevel = calculateNodesAtLevel(level);
        totalNodes += nodesAtLevel;

        // Memory for Map objects at this level
        const mapMemory = nodesAtLevel * MAP_OVERHEAD;

        // Memory for entries (key-value pairs) at this level
        const entriesMemory = nodesAtLevel * branchingFactor * (NUMBER_SIZE + ENTRY_OVERHEAD);

        totalMemory += mapMemory + entriesMemory;
    }

    return {
        totalNodes,
        totalMemoryBytes: totalMemory,
        totalMemoryMB: totalMemory / (1024 * 1024),
        totalMemoryGB: totalMemory / (1024 * 1024 * 1024)
    };
}

// Example usage:
console.log("Memory usage for depth=50, branching=50:");
console.log(calculateMapMemoryUsage(50, 50));

// Find maximum possible depth for given memory limit (e.g., 4GB)
function findMaxDepth(branchingFactor, memoryLimitGB = 4) {
    let depth = 1;
    while (true) {
        const usage = calculateMapMemoryUsage(depth, branchingFactor);
        if (usage.totalMemoryGB > memoryLimitGB) {
            return depth - 1;
        }
        depth++;
    }
}

console.log("\nMaximum depth possible with 4GB memory limit:");
console.log("Branching factor 100:", findMaxDepth(100));
