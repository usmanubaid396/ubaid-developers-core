@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'JetBrains Mono', monospace;
    background-color: #000000;
    color: #ffffff;
    overflow-x: hidden;
  }
}

.brutalist-border {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brutalist-border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.stroke-text {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.9);
  color: transparent;
}
