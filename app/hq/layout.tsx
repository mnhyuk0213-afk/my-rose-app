export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`.vela-nav,.vela-mobile-tab{display:none!important}body{padding-top:0!important}`}</style>
      {children}
    </>
  );
}
