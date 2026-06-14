import { Source_Code_Pro, Geist, Smythe, Rock_Salt, Alegreya } from "next/font/google"
import localFont from "next/font/local";

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin-ext"],
  weight: "400"
})

export const fontSmythe = Smythe({
    variable: "--font-smythe",
    weight: "400",
})

export const fontRockSalt = Rock_Salt({
    variable: "--font-rock-salt",
    weight: "400",
})

export const fontAlegreya = Alegreya({
    variable: "--font-alegreya",
    weight: "400",
})

export const fontMinecraftTen = localFont({
  src: '../../public/fonts/minecraft-ten.woff',
  variable: "--font-minecraft-ten",
})

export const fontMinecraftSeven = localFont({
  src: '../../public/fonts/minecraft-seven.woff2',
  variable: "--font-minecraft-seven",
})
