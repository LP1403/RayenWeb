import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Tag } from 'lucide-react';
import { useCategories, useCategoryOperations } from '../hooks/useCategories';
import { Category, CreateCategoryData } from '../types/Category';

const Categories = () => {
    const { categories, loading, error, refresh } = useCategories();
    const { create, update, remove, loading: operationLoading } = useCategoryOperations();

    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<CreateCategoryData>({
        name: '',
        slug: '',
        description: '',
        isActive: true,
        icon: '',
        color: '#3B82F6',
        sortOrder: 0
    });

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await update(editingCategory.id, formData);
            } else {
                await create(formData);
            }
            setShowForm(false);
            setEditingCategory(null);
            resetForm();
            refresh();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            isActive: category.isActive,
            icon: category.icon || '',
            color: category.color || '#3B82F6',
            sortOrder: category.sortOrder || 0
        });
        setShowForm(true);
    };

    const handleDelete = async (category: Category) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
            try {
                await remove(category.id);
                refresh();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleToggleActive = async (category: Category) => {
        try {
            await update(category.id, { isActive: !category.isActive });
            refresh();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            isActive: true,
            icon: '',
            color: '#3B82F6',
            sortOrder: 0
        });
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }));
    };

    if (loading) {
        return (
            <div className="space-y-6 bg-gray-900 min-h-screen p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 bg-gray-900 min-h-screen p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-900 min-h-screen p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestión de Categorías</h1>
                    <p className="text-gray-300 mt-2">Administra las categorías de productos</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingCategory(null);
                        resetForm();
                    }}
                    className="btn-primary flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Categoría
                </button>
            </div>

            {/* Search */}
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar categorías..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-primary pl-10"
                    />
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Orden
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {category.icon && (
                                                <span className="text-2xl mr-3">{category.icon}</span>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </div>
                                                {category.description && (
                                                    <div className="text-sm text-gray-500">
                                                        {category.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                            {category.slug}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {category.isActive ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {category.sortOrder}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="btn-action text-blue-600 hover:text-blue-900"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(category)}
                                                className={`btn-action ${category.isActive
                                                        ? 'text-orange-600 hover:text-orange-900'
                                                        : 'text-green-600 hover:text-green-900'
                                                    }`}
                                                title={category.isActive ? 'Desactivar' : 'Activar'}
                                            >
                                                {category.isActive ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                className="btn-action text-red-600 hover:text-red-900"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* No categories message */}
            {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                    <Tag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'No se encontraron categorías con ese término.' : 'Comienza creando una nueva categoría.'}
                    </p>
                </div>
            )}

            {/* Category Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">
                                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingCategory(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className="input-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Slug *
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    className="input-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="input-primary"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Icono (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                        className="input-primary"
                                        placeholder="👕"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Color
                                    </label>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        className="input-primary h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Orden
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.sortOrder}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                                        className="input-primary"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-300">Activa</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingCategory(null);
                                        resetForm();
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={operationLoading}
                                    className="btn-primary"
                                >
                                    {operationLoading ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
