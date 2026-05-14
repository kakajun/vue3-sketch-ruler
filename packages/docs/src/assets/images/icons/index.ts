export const svgs = import.meta.glob('./*.svg', { eager: true, query: '?raw', import: 'default' })
export const IconProps = {
  name: String,
  color: String,
  size: [String, Number]
}

export const getIcon = (name?: string): string => {
  if (!name) return ''
  return svgs[`./${name}.svg`]
}
