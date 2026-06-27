import { ref, reactive, type Ref } from 'vue'

/**
 * 智能图片路径 composable
 * 自动探测图片扩展名，按 webp → jpg → jpeg → png 顺序尝试
 *
 * 用法 1（单个图片）：
 *   const heroImg = useImagePath('beauty_hero')
 *   → heroImg.value = '/images/beauty_hero.png'（探测成功后）
 *
 * 用法 2（多个图片批量注册，推荐）：
 *   const img = useImagePaths(['beauty_hero', 'beauty_skin'])
 *   → 模板中直接用 img.beauty_hero（reactive 自动解包）
 *
 * 用法 3（key 映射）：
 *   const img = useImagePathMap({ skin: 'beauty_skin', body: 'beauty_body' })
 *   → 模板中直接用 img.skin / img.body
 */

const EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png'] as const

function probeImage(src: string): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

// 单个图片路径探测，返回 Ref<string>（始终有值，默认 .jpg 兜底）
export function useImagePath(baseName: string, folder = 'images'): Ref<string> {
  const result = ref(`/${folder}/${baseName}.jpg`)
  const tryNext = async (index: number) => {
    if (index >= EXTENSIONS.length) return
    const ext = EXTENSIONS[index]
    const src = `/${folder}/${baseName}.${ext}`
    const ok = await probeImage(src)
    if (ok) {
      result.value = src
    } else {
      await tryNext(index + 1)
    }
  }
  tryNext(0)
  return result
}

// 批量注册多个图片，返回 reactive 对象（模板中自动解包 Ref）
export function useImagePaths(
  baseNames: string[],
  folder = 'images'
): Record<string, string> {
  const map: Record<string, Ref<string>> = {}
  for (const name of baseNames) {
    map[name] = useImagePath(name, folder)
  }
  return reactive(map) as Record<string, string>
}

// 高级用法：传入 Record<key, baseName>，返回同结构 reactive 映射
export function useImagePathMap(
  entries: Record<string, string>,
  folder = 'images'
): Record<string, string> {
  const map: Record<string, Ref<string>> = {}
  for (const key of Object.keys(entries)) {
    map[key] = useImagePath(entries[key], folder)
  }
  return reactive(map) as Record<string, string>
}
