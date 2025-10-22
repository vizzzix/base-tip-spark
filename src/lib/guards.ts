// Runtime guards for debugging React errors
export function assertElement(name: string, element: any): void {
  if (!element) {
    throw new Error(`React Error: ${name} is undefined or null. Check imports and exports.`);
  }
  if (typeof element !== 'function' && typeof element !== 'object') {
    throw new Error(`React Error: ${name} is not a valid React element. Got: ${typeof element}`);
  }
}

export function safeRender(component: any, fallback: React.ReactNode = null): React.ReactNode {
  try {
    return component;
  } catch (error) {
    console.error('Render error:', error);
    return fallback;
  }
}
