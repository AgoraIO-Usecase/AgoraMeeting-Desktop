import { useEffect, useRef } from 'react';
import type { RendererPlayerProps } from '@/ui-kit/capabilities/containers/renderer-player';

type UseWatchCallback<T> = (prev: T | undefined) => void;
type UseWatchConfig = {
  immediate: boolean;
};

export const useEffectOnce = (effect: any) => {
  useEffect(effect, []);
};

export const useWatch = <T>(
  dep: T,
  callback: UseWatchCallback<T>,
  config: UseWatchConfig = { immediate: false },
) => {
  const { immediate } = config;

  const prev = useRef<T>();
  const inited = useRef(false);
  const stop = useRef(false);
  const execute = () => callback(prev.current);

  useEffect(() => {
    if (!stop.current) {
      if (!inited.current) {
        inited.current = true;
        if (immediate) {
          execute();
        }
      } else {
        execute();
      }
      prev.current = dep;
    }
  }, [dep]);

  return () => {
    stop.current = true;
  };
};

export const useUnMount = (cb: CallableFunction) => {
  useEffect(() => {
    return () => cb();
  }, []);
};

export const useMounted = () => {
  const mounted = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted.current;
};

export const useTimeout = (fn: CallableFunction, delay: number) => {
  const mounted = useMounted();

  const timer = useRef<any>(null);

  useEffect(() => {
    timer.current = setTimeout(() => {
      fn && mounted && fn();
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    }, delay);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [timer]);
};

export const useAudioPlayer = (url: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useUnMount(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  });

  useEffect(() => {
    const audioElement = new Audio(url);
    audioElement.onended = () => {};
    audioElement.play();
    audioRef.current = audioElement;
  }, [audioRef]);
};

export const usePrevious = <Type>(value: Type) => {
  const previousValue = useRef<Type>(value);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return previousValue.current;
};

export const useRendererPlayer = <T extends HTMLElement>(
  props: RendererPlayerProps,
) => {
  const ref = useRef<T | null>(null);

  const onRendererPlayer = <T extends HTMLElement>(
    dom: T,
    player: RendererPlayerProps,
  ) => {
    if (dom && player.track) {
      console.log('dom && player.track');
      player.track.play && player.track.play(dom, player?.videoPlayerConfig);
    }
    return () => {
      player.track && player.track.stop && player.track.stop(props.preview);
    };
  };

  useEffect(() => onRendererPlayer<T>(ref.current!, props), [
    ref,
    props.track,
    props.videoPlayerConfig?.fit,
    props.videoPlayerConfig?.mirror,
    props.preview,
  ]);

  return ref;
};
