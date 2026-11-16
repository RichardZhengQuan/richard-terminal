import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
} from "react";

type DynamicOptions = {
  ssr?: boolean;
  loading?: ComponentType;
};

// The browser-direct bundle has no server-rendering runtime. esbuild includes
// this lazy import in the same script, while Suspense handles its first render.
export default function dynamic<Props extends object>(
  loader: () => Promise<{ default: ComponentType<Props> }>,
  options: DynamicOptions = {},
): ComponentType<Props> {
  const Component = lazy(loader);
  const Loading = options.loading;

  return function StandaloneDynamic(props: Props) {
    return createElement(
      Suspense,
      { fallback: Loading ? createElement(Loading) : null },
      createElement(Component as ComponentType<Props>, props),
    );
  };
}
