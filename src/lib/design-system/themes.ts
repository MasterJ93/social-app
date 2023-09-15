import {create} from './lib'

export type Theme = typeof light

export const light = create({
  tokens: {
    space: {
      s: 10,
      m: 16,
      l: 24,
    },
    // naming inspo https://polaris.shopify.com/tokens/color
    color: {
      surface: '#fff',

      // Text
      text: '#000',
      textInverted: '#fff',

      // Interactive elements
      textLink: '#0085ff',

      // UI
      border: '#f0e9e9',
    },
    fontSize: {
      xxs: 10,
      xs: 12,
      s: 14,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 48,
    },
    lineHeight: {
      xxs: 10,
      xs: 12,
      s: 14,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 48,
    },
    fontFamily: {
      inter: 'sans-serif',
      roboto: 'monospace',
    },
  },
  properties: {
    d: ['display'],
    w: ['width'],
    h: ['height'],
    c: ['color'],
    bg: ['backgroundColor'],
    ma: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
    mr: ['marginRight'],
    my: ['marginTop', 'marginBottom'],
    mx: ['marginLeft', 'marginRight'],
    /**
     * Alias for `padding`, maps to all padding properties e.g. `paddingTop`,
     * `paddingBottom`, etc.
     */
    pa: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    pt: ['paddingTop'],
    pb: ['paddingBottom'],
    pl: ['paddingLeft'],
    pr: ['paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    px: ['paddingLeft', 'paddingRight'],
    z: ['zIndex'],
    fs: ['fontSize'],
    ff: ['fontFamily'],
    fw: ['fontWeight'],
    lh: ['lineHeight'],
    ta: ['textAlign'],
    radius: ['borderRadius'],
  },
  macros: {
    inline: (_: boolean) => ({flexDirection: 'row'}),
    aic: (_: boolean) => ({alignItems: 'center'}),
    aie: (_: boolean) => ({alignItems: 'flex-end'}),
    jcs: (_: boolean) => ({justifyContent: 'flex-start'}),
    jcc: (_: boolean) => ({justifyContent: 'center'}),
    jce: (_: boolean) => ({justifyContent: 'flex-end'}),
    jcb: (_: boolean) => ({justifyContent: 'space-between'}),
    rel: (_: boolean) => ({position: 'relative'}),
    abs: (_: boolean) => ({position: 'absolute'}),
    cover: (_: boolean) => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
    tac: (_: boolean) => ({textAlign: 'center'}),
    tar: (_: boolean) => ({textAlign: 'right'}),
    mxa: (_: boolean) => ({marginLeft: 'auto', marginRight: 'auto'}),
    mya: (_: boolean) => ({marginTop: 'auto', marginBottom: 'auto'}),
    /**
     * Macro for applying `{ textTransform: 'uppercase' }` to a style.
     */
    caps: (_: boolean) => ({textTransform: 'uppercase'}),
    font(value: 'sans' | 'mono', tokens) {
      return {
        fontFamily:
          value === 'sans' ? tokens.fontFamily.inter : tokens.fontFamily.roboto,
      }
    },
  },
  breakpoints: {
    gtPhone: 640,
  },
})

export const dark: typeof light = create({
  ...light.config,
  tokens: {
    ...light.config.tokens,
    color: {
      surface: '#000',

      // Text
      text: '#fff',
      textInverted: '#000',

      // Interactive elements
      textLink: '#0085ff',

      // UI
      border: '#f0e9e9',
    },
  },
})