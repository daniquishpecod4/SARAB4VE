import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "filled" | "outlined" | "text" | "filled-tonal";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconPosition?: "start" | "end";
  children?: ReactNode;
  className?: string;
}

interface ButtonProps extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface LinkProps extends BaseProps {
  href: string;
}

type Props = ButtonProps | LinkProps;

const variantStyles: Record<Variant, string> = {
  filled:
    "bg-primary text-on-primary hover:opacity-90 active:opacity-80",
  outlined:
    "border border-outline text-primary bg-transparent hover:bg-primary-fixed active:bg-primary-fixed",
  text:
    "text-primary bg-transparent hover:bg-primary-fixed active:bg-primary-fixed",
  "filled-tonal":
    "bg-secondary-container text-on-secondary hover:opacity-90 active:opacity-80",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm gap-1.5",
  md: "px-6 py-2.5 text-base gap-2",
  lg: "px-8 py-3.5 text-lg gap-2",
};

function classNames(
  variant: Variant,
  size: Size,
  extra?: string
): string {
  return [
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors",
    "min-h-[48px] focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantStyles[variant],
    sizeStyles[size],
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button(props: Props) {
  const {
    variant = "filled",
    size = "md",
    icon,
    iconPosition = "start",
    children,
    className,
  } = props;

  const cn = classNames(variant, size, className);

  const content = (
    <>
      {icon && iconPosition === "start" && (
        <span className="material-symbols-rounded text-[1.25em]" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === "end" && (
        <span className="material-symbols-rounded text-[1.25em]" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cn}>
        {content}
      </Link>
    );
  }

  const { href: _href, iconPosition: _ip, icon: _icon, variant: _v, size: _s, ...rest } =
    props as ButtonProps & { href?: never };
  return (
    <button className={cn} {...rest}>
      {content}
    </button>
  );
}
