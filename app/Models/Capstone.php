<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capstone extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'demo_url',
        'download_url',
        'download_file',
        'thumbnail',
        'category',
        'technologies',
        'is_available',
    ];

    protected $casts = [
        'technologies' => 'array',
        'price'        => 'decimal:2',
        'is_available' => 'boolean',
    ];
}
