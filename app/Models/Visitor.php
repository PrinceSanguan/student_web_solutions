<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    protected $table = 'visitor_analytics';
    protected $fillable = ['ip_address', 'country', 'device_type', 'page_visited'];
}
