import { useEffect } from 'react';

export function usePageTitle(title: string | undefined, suffix = 'Workflow Builder') {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${suffix}`;
    }
    return () => {
      document.title = suffix;
    };
  }, [title, suffix]);
}
