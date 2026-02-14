interface TaxiLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TaxiLogo({ size = "md", className = "" }: TaxiLogoProps) {
  const sizes = {
    sm: { text: "text-lg", taxi: "text-sm", sub: "text-[8px]", px: "px-3", py: "py-0.5", border: "border-2" },
    md: { text: "text-3xl", taxi: "text-xl", sub: "text-[10px]", px: "px-5", py: "py-1", border: "border-[3px]" },
    lg: { text: "text-5xl", taxi: "text-3xl", sub: "text-xs", px: "px-8", py: "py-1.5", border: "border-4" },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`} data-testid="taxi-logo">
      <span className={`${s.text} font-black tracking-tight leading-none`}>THE</span>
      <div className={`${s.border} border-current rounded-lg rounded-bl-none rounded-br-none ${s.px} ${s.py} mt-1`}>
        <span className={`${s.taxi} font-black tracking-wider`}>TAXI</span>
      </div>
      <span className={`${s.text} font-black tracking-tight leading-none -mt-0.5`}>COMPANY</span>
      <span className={`${s.sub} font-semibold tracking-[0.2em] uppercase mt-1`}>A Denoko Cooperative</span>
    </div>
  );
}
