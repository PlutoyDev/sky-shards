// Modified from https://medium.com/@arm.ninoyan/fixed-react-18-useeffect-runs-twice-8480f0bd837f
import { useEffect, useRef } from 'react';

// If we are in production, use the normal useEffect, otherwise use a modified version so that it only runs once in strict mode
export const useLegacyEffect: typeof useEffect = import.meta.env.PROD
  ? useEffect
  : (effect, deps) => {
      const isMounted = useRef(false);
      useEffect(() => {
        if (isMounted.current) {
          return effect();
        }
        isMounted.current = true;
        return undefined;
      }, deps);
    };

export default useLegacyEffect;
