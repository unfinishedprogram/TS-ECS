import SimplexNoise from "simplex-noise";

let simplex = new SimplexNoise("2");

export function sumOctave(iterations:number, x:number, y:number, persistence:number, scale:number, low:number, high:number){
  let maxAmp = 0;
  let amp = 1;
  let freq = scale;
  let noise = 0;

  for(let i = 0; i < iterations; ++i)  {
		noise += simplex.noise2D(x * freq, y * freq) * amp;
		maxAmp += amp;
		amp *= persistence;
		freq *= 2;
	}

  noise /= maxAmp;
  noise = noise * (high - low) / 2 + (high + low) / 2;
  return noise;
}