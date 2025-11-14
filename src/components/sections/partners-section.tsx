const partners = [
  { name: 'Logoipsum 1', logo: () => <svg width="120" height="40" viewBox="0 0 120 40"><text x="60" y="25" fontFamily="sans-serif" fontSize="14" fill="#888888" textAnchor="middle">LOGOIPSUM</text></svg> },
  { name: 'Logoipsum 2', logo: () => <svg width="120" height="40" viewBox="0 0 120 40"><text x="60" y="25" fontFamily="sans-serif" fontSize="14" fill="#888888" textAnchor="middle" fontWeight="bold">LOGO</text></svg> },
  { name: 'Logoipsum 3', logo: () => <svg width="120" height="40" viewBox="0 0 120 40"><text x="60" y="25" fontFamily="serif" fontSize="16" fill="#888888" textAnchor="middle">Logoipsum</text></svg> },
  { name: 'Logoipsum 4', logo: () => <svg width="120" height="40" viewBox="0 0 120 40"><text x="60" y="25" fontFamily="monospace" fontSize="14" fill="#888888" textAnchor="middle">LOGOIPSUM</text></svg> },
  { name: 'Logoipsum 5', logo: () => <svg width="120" height="40" viewBox="0 0 120 40"><text x="60" y="25" fontFamily="cursive" fontSize="16" fill="#888888" textAnchor="middle">Logoipsum</text></svg> },
  { name: 'Logoipsum 6', logo: () => <svg width="120" height="40" viewBox="0 0 120 40"><text x="60" y="25" fontFamily="fantasy" fontSize="16" fill="#888888" textAnchor="middle">LOGO</text></svg> },
];

export function PartnersSection() {
  return (
    <section className="py-16 bg-background border-t border-b">
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_svg]:max-w-none animate-infinite-scroll group-hover:[animation-play-state:paused]">
            {partners.map((partner, index) => (
                <li key={index}>
                    <partner.logo />
                </li>
            ))}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_svg]:max-w-none animate-infinite-scroll" aria-hidden="true">
            {partners.map((partner, index) => (
                <li key={index}>
                    <partner.logo />
                </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
