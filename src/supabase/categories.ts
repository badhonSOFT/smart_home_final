import { supabase } from './client'

export interface CategoryImage {
  id: string
  category: string
  image_url: string
  title?: string
  is_active: boolean
  created_at?: string
}

export const categoryService = {
  async getCategoryImages(category?: string) {
    try {
      let query = supabase
        .from('category_images')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query
      if (error) {
        console.error('Get category images error:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to fetch category images: ${error.message}`)
      }
      return data || []
    } catch (error) {
      console.error('Category service error:', JSON.stringify(error, null, 2))
      throw error
    }
  },

  async addCategoryImage(categoryImage: Omit<CategoryImage, 'id' | 'created_at'>) {
    try {
      console.log('Adding category image:', JSON.stringify(categoryImage, null, 2))
      const { data, error } = await supabase
        .from('category_images')
        .insert([categoryImage])
        .select()
        .single()
      
      if (error) {
        console.error('Insert category image error:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to add category image: ${error.message}`)
      }
      return data
    } catch (error) {
      console.error('Add category image error:', JSON.stringify(error, null, 2))
      throw error
    }
  },

  async deleteCategoryImage(id: string) {
    try {
      const { error } = await supabase
        .from('category_images')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Delete category image error:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to delete category image: ${error.message}`)
      }
      return true
    } catch (error) {
      console.error('Delete category image error:', JSON.stringify(error, null, 2))
      throw error
    }
  }
}