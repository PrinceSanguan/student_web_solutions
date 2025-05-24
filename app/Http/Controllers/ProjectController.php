<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display the project details page
     *
     * @param Request $request
     * @param int $id
     * @return \Inertia\Response
     */
    public function show(Request $request, $id)
    {
        return Inertia::render('ProjectDetail', [
            'projectId' => $id
        ]);
    }
}
