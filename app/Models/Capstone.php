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
        'thumbnail',
        'category',
        'technologies',
    ];

    protected $casts = [
        'technologies' => 'array',
        'price' => 'decimal:2',
    ];
}
