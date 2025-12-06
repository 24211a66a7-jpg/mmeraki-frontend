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
import { Edit2, Trash2, X, Save, Plus, Calendar } from 'lucide-react';
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
      
      
      // Always fetch all experiences for client-side filtering
      const data = await api.get<any>('/experiences');
      
      if (data && data.success) {
        const items = Array.isArray(data.data) ? data.data : [];
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Events Management</h1>
              <p className="text-gray-600">Create, edit, and manage your event experiences</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredList.length} of {list.length}
                </p>
              </div>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Search Events</Label>
                <Input 
                  placeholder="Search by title, description, category..." 
                  value={filters.search} 
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))} 
                  className="h-10 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
                <Select value={filters.category} onValueChange={(val) => setFilters(prev => ({ ...prev, category: val, subcategory: '' }))}>
                  <SelectTrigger className="h-10 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
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
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Subcategory</Label>
                <Select 
                  value={filters.subcategory} 
                  onValueChange={(val) => setFilters(prev => ({ ...prev, subcategory: val }))}
                  disabled={!filters.category || filters.category === ' '}
                >
                  <SelectTrigger className="h-10 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
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
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ category: '', subcategory: '', search: '' })}
                  className="h-10 w-full hover:bg-gray-50 hover:border-gray-300"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(filters.search || (filters.category && filters.category !== ' ') || (filters.subcategory && filters.subcategory !== ' ')) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  {filters.search && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                      Search: "{filters.search}"
                    </Badge>
                  )}
                  {filters.category && filters.category !== ' ' && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                      Category: {filters.category}
                    </Badge>
                  )}
                  {filters.subcategory && filters.subcategory !== ' ' && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
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
          <Card className={`border-2 ${isEditing ? 'border-blue-300 bg-blue-50/30' : 'border-amber-200 bg-amber-50/30'} mb-6 shadow-lg`}>
            <CardHeader className={`bg-gradient-to-r ${isEditing ? 'from-blue-50 to-cyan-50' : 'from-amber-50 to-pink-50'} border-b-2 ${isEditing ? 'border-blue-200' : 'border-amber-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`text-xl font-bold ${isEditing ? 'text-blue-800' : 'text-amber-800'}`}>
                    {isEditing ? `Edit Event: ${form.title}` : 'Create New Event'}
                  </CardTitle>
                  <p className={`text-sm ${isEditing ? 'text-blue-600' : 'text-amber-600'} mt-1`}>
                    {isEditing ? 'Update event details and settings' : 'Add a new event experience to your collection'}
                  </p>
                </div>
                <Button onClick={resetForm} variant="ghost" size="sm" className="hover:bg-white/50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">Event Title *</Label>
                  <Input 
                    id="title" 
                    value={form.title} 
                    onChange={e => handleChange('title', e.target.value)}
                    placeholder="Enter event title"
                    className="h-10 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">Category *</Label>
                  <Select value={form.category} onValueChange={(val) => {
                    handleChange('category', val);
                    handleChange('subcategory', '');
                  }}>
                    <SelectTrigger id="category" className="h-10 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
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
                  <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700 mb-2 block">Subcategory</Label>
                  <Select value={form.subcategory} onValueChange={(val) => handleChange('subcategory', val)} disabled={!form.category}>
                    <SelectTrigger id="subcategory" className="h-10 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
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
                  <Label htmlFor="base_price" className="text-sm font-medium text-gray-700 mb-2 block">Base Price (₹)</Label>
                  <Input 
                    id="base_price" 
                    type="number" 
                    value={form.base_price} 
                    onChange={e => handleChange('base_price', e.target.value)}
                    placeholder="Enter price"
                    className="h-10 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="thumbnail_url" className="text-sm font-medium text-gray-700 mb-2 block">Thumbnail Image URL</Label>
                  <Input 
                    id="thumbnail_url" 
                    value={form.thumbnail_url} 
                    onChange={e => handleChange('thumbnail_url', e.target.value)}
                    placeholder="https://example.com/image.jpg or Google Drive link"
                    className="h-10 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supports: Direct URLs, Google Drive links, Base64 images
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="images" className="text-sm font-medium text-gray-700 mb-2 block">Additional Images (comma separated URLs)</Label>
                  <Textarea 
                    id="images" 
                    value={form.images} 
                    onChange={e => handleChange('images', e.target.value)}
                    placeholder="https://example.com/image1.jpg, https://drive.google.com/file/d/.../view, data:image/jpeg;base64,..."
                    className="border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    rows={3}
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    <p className="font-medium mb-1">Supported formats:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      <li>Direct web URLs: <code className="bg-gray-100 px-1 rounded">https://example.com/image.jpg</code></li>
                      <li>Google Drive links: <code className="bg-gray-100 px-1 rounded">https://drive.google.com/file/d/...</code></li>
                      <li>Base64 images: <code className="bg-gray-100 px-1 rounded">data:image/jpeg;base64,...</code></li>
                    </ul>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="short_desc" className="text-sm font-medium text-gray-700 mb-2 block">Short Description</Label>
                  <Textarea 
                    id="short_desc" 
                    value={form.short_desc} 
                    onChange={e => handleChange('short_desc', e.target.value)}
                    placeholder="Brief description of the event"
                    className="border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">Detailed Description</Label>
                  <Textarea 
                    id="description" 
                    value={form.description} 
                    onChange={e => handleChange('description', e.target.value)} 
                    placeholder="Detailed description of the event experience"
                    className="border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    rows={4} 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                {isEditing && (
                  <Button onClick={resetForm} variant="outline" className="px-6">
                    Cancel
                  </Button>
                )}
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className={`px-6 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600'} text-white shadow-lg hover:shadow-xl transition-all`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {isEditing ? 'Update Event' : 'Create Event'}
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
      )}

        {/* Events List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Events List</h2>
              <p className="text-gray-600">
                {isLoading ? 'Loading events...' : `Showing ${filteredList.length} of ${list.length} events`}
              </p>
            </div>
            {!isLoading && filteredList.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-lg font-semibold text-gray-900">{list.length}</p>
              </div>
            )}
          </div>
        
          {error && (
            <Card className="mb-6 border-2 border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <div className="text-red-600 mb-4">
                  <X className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Error Loading Events</h3>
                  <p className="text-sm">{error}</p>
                </div>
                <Button 
                  onClick={fetchList} 
                  variant="outline" 
                  className="text-red-700 border-red-300 hover:bg-red-100"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border border-gray-200 bg-white">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <Card className="border-2 border-amber-100">
              <CardContent className="p-12 text-center">
                <div className="text-amber-600 mb-4">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                  <p className="text-gray-600 mb-6">
                    {filters.search || filters.category || filters.subcategory 
                      ? 'Try adjusting your filters or search terms to find events'
                      : 'Get started by creating your first event experience'
                    }
                  </p>
                  {!filters.search && !filters.category && !filters.subcategory && (
                    <Button 
                      onClick={() => setShowForm(true)} 
                      className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Event
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredList.map((item) => (
                <Card key={item.id} className={`border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg group bg-white ${isEditing && form.id === item.id ? 'ring-2 ring-blue-200 border-blue-300' : ''}`}>
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <img 
                            src={item.thumbnail_url || '/placeholder.svg'} 
                            alt={item.title} 
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200" 
                          />
                          {item.is_featured && (
                            <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">Featured</Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">{item.title}</h3>
                              <div className="flex flex-wrap gap-1 mb-2">
                                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">{item.category}</Badge>
                                {item.subcategory && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">{item.subcategory}</Badge>}
                                {item.template_type && <Badge variant="outline" className="text-xs border-gray-300">{item.template_type}</Badge>}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.short_desc || item.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="text-lg font-bold text-amber-600">₹{item.base_price?.toLocaleString?.() || item.base_price || 0}</span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                onClick={() => handleEdit(item)}
                                title="Edit event"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700 transition-colors"
                                onClick={() => confirmDelete(item.id)}
                                title="Delete event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">Delete Event</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete this event? This action cannot be undone and will permanently remove the event from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-gray-50">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Event
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminEvents;