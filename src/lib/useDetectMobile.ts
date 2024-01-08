import React from 'react';

export default function useDetectMobile() {
  const [isMobile, setMobile] = React.useState<boolean | undefined>(undefined);
  const detectMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    setMobile(mobile);
  };

  React.useEffect(() => {
    detectMobile();

    window.addEventListener('resize', detectMobile);

    return () => {
      window.removeEventListener('resize', detectMobile);
    };
  }, []);

  return { isMobile };
}
