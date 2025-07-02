import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import FOG from 'vanta/dist/vanta.fog.min'

export default function VantaFogBackground() {
  const vantaRef = useRef<HTMLDivElement | null>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0xf3ebe0, // very pale warm beige (unchanged)
          midtoneColor: 0xe9ded2, // softer warm sand, less saturated
          lowlightColor: 0xdcd1c2, // gentle muted brown-beige
          baseColor: 0xfaf7f2, // almost white cream (unchanged)

          speed: 4.5,
        }),
      )
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div ref={vantaRef} className="fixed left-0 top-0 -z-10 h-full w-full" />
  )
}
