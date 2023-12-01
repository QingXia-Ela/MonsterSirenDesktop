import $customRouter, {
  setCanRoute,
  setPageEntered,
  setRouterPath,
} from '@/store/models/router';

export default function navigate(url: string, duration = 700) {
  const { canRoute } = $customRouter.get();
  if (canRoute) {
    setRouterPath(url);
    setCanRoute(false);

    setTimeout(() => {
      setCanRoute(true);
    }, duration);
  }
}
