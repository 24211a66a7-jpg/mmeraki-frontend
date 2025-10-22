import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getCategories, getSubcategoryOptions } from '@/data/menuConfig';
import { Edit2, Trash2, X, Save, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const AdminEvents = () => {
  const [form, setForm] = useState({
    id: '',
    title: '',
    category: '',
    subcategory: '',
    short_desc: '',
    description: '',
    base_price: '',
    thumbnail_url: '',
    images: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    search: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm({ id: '', title: '', category: '', subcategory: '', short_desc: '', description: '', base_price: '', thumbnail_url: '', images: '' });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setForm({
      id: item.id,
      title: item.title || '',
      category: item.category || '',
      subcategory: item.subcategory || '',
      short_desc: item.short_desc || '',
      description: item.description || '',
      base_price: item.base_price?.toString() || '',
      thumbnail_url: item.thumbnail_url || '',
      images: Array.isArray(item.images) ? item.images.join(', ') : ''
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload: any = {
        title: form.title,
        category: form.category,
        subcategory: form.subcategory || undefined,
        short_desc: form.short_desc || undefined,
        description: form.description || undefined,
        base_price: form.base_price ? Number(form.base_price) : undefined,
        thumbnail_url: form.thumbnail_url || undefined,
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      };

      const path = isEditing ? `/experiences/${form.id}` : '/experiences';
      const data = await api.request<any>(path, { method: isEditing ? 'PUT' : 'POST', body: payload });
      
      toast({
        title: isEditing ? "Experience Updated" : "Experience Created",
        description: `Successfully ${isEditing ? 'updated' : 'created'} "${form.title}"`,
      });
      
      await fetchList();
      resetForm();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || `${isEditing ? 'Update' : 'Creation'} failed`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await api.delete(`/experiences/${itemToDelete}`);
      
      toast({
        title: "Experience Deleted",
        description: "Experience has been successfully deleted",
      });
      
      await fetchList();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || 'Deletion failed',
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const fetchList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching all experiences for client-side filtering');
      
      // Always fetch all experiences for client-side filtering
      const data = await api.get<any>('/experiences');
      console.log('API response:', data);
      
      if (data && data.success) {
        const items = Array.isArray(data.data) ? data.data : [];
        console.log('Processed items:', items.length, items);
        setList(items.sort((a: any, b: any) => (new Date(b.created_at).getTime()) - (new Date(a.created_at).getTime())));
      } else {
        console.error('API response not successful:', data);
        setError('Failed to fetch experiences from server');
        setList([]);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Error connecting to server. Please check your connection.');
      setList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    let filtered = list;
    
    // Apply search filter (client-side)
    if (filters.search) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.short_desc?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.category?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.subcategory?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Apply category filter (client-side)
    if (filters.category && filters.category !== ' ') {
      if (filters.category === 'birthdays') {
        // Special handling for birthdays - look for birthday-related experiences
        filtered = filtered.filter(item => 
          item.category === 'birthdays' ||
          item.title?.toLowerCase().includes('birthday') ||
          item.description?.toLowerCase().includes('birthday') ||
          item.short_desc?.toLowerCase().includes('birthday') ||
          item.subcategory?.toLowerCase().includes('birthday')
        );
      } else {
        filtered = filtered.filter(item => item.category === filters.category);
      }
    }
    
    // Apply subcategory filter (client-side)
    if (filters.subcategory && filters.subcategory !== ' ') {
      filtered = filtered.filter(item => item.subcategory === filters.subcategory);
    }
    
    return filtered;
  }, [list, filters.search, filters.category, filters.subcategory]);

  useEffect(() => { fetchList(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Manage Events</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, delete, and filter experiences</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Experience
          </Button>
        )}
      </div>

      {/* Horizontal Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs mb-1">Search</Label>
              <Input 
                placeholder="Search by title, description, category..." 
                value={filters.search} 
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))} 
                className={filters.search ? 'border-amber-300 bg-amber-50' : ''}
              />
            </div>
            <div className="min-w-[180px]">
              <Label className="text-xs mb-1">Category</Label>
              <Select value={filters.category} onValueChange={(val) => setFilters(prev => ({ ...prev, category: val, subcategory: '' }))}>
                <SelectTrigger className={filters.category && filters.category !== ' ' ? 'border-amber-300 bg-amber-50' : ''}>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value=" ">All categories</SelectItem>
                    {getCategories().map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[180px]">
              <Label className="text-xs mb-1">Subcategory</Label>
              <Select 
                value={filters.subcategory} 
                onValueChange={(val) => setFilters(prev => ({ ...prev, subcategory: val }))}
                disabled={!filters.category || filters.category === ' '}
              >
                <SelectTrigger className={filters.subcategory && filters.subcategory !== ' ' ? 'border-amber-300 bg-amber-50' : ''}>
                  <SelectValue placeholder={filters.category && filters.category !== ' ' ? 'All subcategories' : 'Select category first'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value=" ">All subcategories</SelectItem>
                    {filters.category && filters.category !== ' ' && getSubcategoryOptions(filters.category).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ category: '', subcategory: '', search: '' })}
              className={filters.search || (filters.category && filters.category !== ' ') || (filters.subcategory && filters.subcategory !== ' ') ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : ''}
            >
              Clear Filters
            </Button>
          </div>
          
          {/* Active Filters Display */}
          {(filters.search || (filters.category && filters.category !== ' ') || (filters.subcategory && filters.subcategory !== ' ')) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.search && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    Search: "{filters.search}"
                  </Badge>
                )}
                {filters.category && filters.category !== ' ' && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Category: {filters.category}
                  </Badge>
                )}
                {filters.subcategory && filters.subcategory !== ' ' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Subcategory: {filters.subcategory}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form (shown only when showForm is true) */}
      {showForm && (
        <Card className={`border-2 ${isEditing ? 'border-blue-300' : 'border-amber-200'} mb-6`}>
          <CardHeader className={`bg-gradient-to-r ${isEditing ? 'from-blue-50 to-cyan-50' : 'from-pink-50 to-amber-50'}`}>
            <div className="flex items-center justify-between">
              <CardTitle className={isEditing ? 'text-blue-800' : 'text-amber-800'}>
                {isEditing ? `Edit Experience: ${form.title}` : 'Create Experience'}
              </CardTitle>
              <Button onClick={resetForm} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={form.title} onChange={e => handleChange('title', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={form.category} onValueChange={(val) => {
                    handleChange('category', val);
                    handleChange('subcategory', '');
                  }}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {getCategories().map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select value={form.subcategory} onValueChange={(val) => handleChange('subcategory', val)} disabled={!form.category}>
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder={form.category ? 'Select a subcategory' : 'Select category first'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {getSubcategoryOptions(form.category).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="base_price">Base Price</Label>
                  <Input id="base_price" type="number" value={form.base_price} onChange={e => handleChange('base_price', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <Input id="thumbnail_url" value={form.thumbnail_url} onChange={e => handleChange('thumbnail_url', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="images">Images (comma separated URLs)</Label>
                  <Input id="images" value={form.images} onChange={e => handleChange('images', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="short_desc">Short Description</Label>
                  <Textarea id="short_desc" value={form.short_desc} onChange={e => handleChange('short_desc', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={form.description} onChange={e => handleChange('description', e.target.value)} rows={4} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {isEditing && (
                  <Button onClick={resetForm} variant="outline">Cancel</Button>
                )}
                <Button onClick={handleSubmit} disabled={isSubmitting} className={isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-600 hover:bg-amber-700'}>
                  {isEditing ? 'Update Experience' : 'Create Experience'}
                </Button>
              </div>
            </CardContent>
          </Card>
      )}

      {/* Experiences List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Latest Experiences ({filteredList.length})
          {isLoading && <span className="text-sm text-gray-500 ml-2">(Loading...)</span>}
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={fetchList} 
              variant="outline" 
              size="sm" 
              className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-2 border-gray-200">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No experiences found</div>
            <p className="text-gray-400 mb-4">
              {filters.search || filters.category || filters.subcategory 
                ? 'Try adjusting your filters or search terms'
                : 'Get started by creating your first experience'
              }
            </p>
            {!filters.search && !filters.category && !filters.subcategory && (
              <Button onClick={() => setShowForm(true)} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Experience
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredList.map((item) => (
                <Card key={item.id} className={`border-2 ${isEditing && form.id === item.id ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-200'} transition-all hover:shadow-lg hover:border-amber-300`}>
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.thumbnail_url || '/placeholder.svg'} 
                          alt={item.title} 
                          className="w-32 h-32 object-cover rounded-lg" 
                        />
                        {item.is_featured && (
                          <Badge className="absolute top-1 left-1 bg-yellow-500 text-black text-xs">Featured</Badge>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
                            <div className="flex flex-wrap gap-1 mb-2">
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">{item.category}</Badge>
                              {item.subcategory && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">{item.subcategory}</Badge>}
                              {item.template_type && <Badge variant="outline" className="text-xs">{item.template_type}</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.short_desc || item.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="text-xl font-bold text-amber-600">₹{item.base_price?.toLocaleString?.() || item.base_price || 0}</span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 hover:bg-blue-50"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 hover:bg-red-50"
                              onClick={() => confirmDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the experience from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEvents;