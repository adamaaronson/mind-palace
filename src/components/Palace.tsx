const GRID_WIDTH = 11;
const GRID_DEPTH = 11;
const GRID_HEIGHT = 11;

const BLOCK_TOP_HEIGHT = 18;
const BLOCK_SIDE_HEIGHT = 22;
const BLOCK_WIDTH = 36;

const ORIGIN_X = (GRID_DEPTH / 2) * BLOCK_WIDTH - BLOCK_WIDTH / 2;
const ORIGIN_Y = GRID_HEIGHT * BLOCK_SIDE_HEIGHT;

export default function Palace() {
  // project 3-dimensional coordinates onto isometric view
  // x: to the right and down a bit
  // y: up
  // z: to the left and down a bit
  const getIsometricProjection = (x: number, y: number, z: number) => {
    return {
      x: ORIGIN_X + (x - z) * (BLOCK_WIDTH / 2),
      y: ORIGIN_Y + (x + z) * (BLOCK_TOP_HEIGHT / 2) - y * BLOCK_SIDE_HEIGHT,
    };
  };

  return (
    <div className="p-4 pl-8 mb-4 bg-light mx-4 border-2 border-border">
      <h3 className="text-2xl font-bold mb-2">Build</h3>
      <div className="h-120 relative">
        {Array.from({ length: GRID_WIDTH }).map((_, width) =>
          Array.from({ length: GRID_DEPTH }).map((_, depth) => {
            const { x, y } = getIsometricProjection(width, 0, depth);
            return (
              <img
                src="block-floor.svg"
                key={`${width},${depth}`}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                }}
              />
            );
          })
        )}
        {Array.from({ length: GRID_WIDTH }).map((_, width) =>
          Array.from({ length: GRID_DEPTH }).map((_, depth) =>
            Array.from({ length: GRID_HEIGHT }).map((_, height) => {
              if (
                width <= height ||
                width >= GRID_WIDTH - height - 1 ||
                depth <= height ||
                depth >= GRID_DEPTH - height - 1
              ) {
                return null;
              }
              const { x, y } = getIsometricProjection(width, height + 1, depth);
              return (
                <img
                  src="block.svg"
                  key={`${width},${height},${depth}`}
                  className="absolute"
                  style={{
                    left: x,
                    top: y,
                  }}
                />
              );
            })
          )
        )}
      </div>
    </div>
  );
}
