import { supabase } from './client'

export const storageService = {
  async uploadProductImage(file: File, productId?: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${productId || Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      console.log('Uploading file:', fileName.replace(/[^a-zA-Z0-9.-]/g, ''), 'Size:', file.size)

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error('Storage upload error:', JSON.stringify(error, null, 2))
        throw new Error(`Upload failed: ${error.message}`)
      }

      console.log('Upload successful:', JSON.stringify(data, null, 2))

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      console.log('Public URL:', publicUrl.replace(/[^a-zA-Z0-9:/.?&=-]/g, ''))
      return publicUrl
    } catch (error) {
      console.error('Upload service error:', JSON.stringify(error, null, 2))
      throw error
    }
  },

  async deleteProductImage(imageUrl: string) {
    const path = imageUrl.split('/').pop()
    if (!path) return

    const { error } = await supabase.storage
      .from('product-images')
      .remove([`products/${path}`])

    if (error) throw error
  }
}