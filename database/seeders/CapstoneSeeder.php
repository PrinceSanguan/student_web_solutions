<?php

namespace Database\Seeders;

use App\Models\Capstone;
use Illuminate\Database\Seeder;

class CapstoneSeeder extends Seeder
{
    public function run(): void
    {
        $capstones = [
            [
                'title' => 'Point of Sale System',
                'slug' => 'point-of-sale-system',
                'description' => 'A complete POS system for retail businesses. Handles sales transactions, inventory tracking, receipt generation, and daily sales reports. Built with PHP and MySQL, ready to deploy on any shared hosting.',
                'price' => 499.00,
                'demo_url' => 'https://choros.io',
                'thumbnail' => 'https://media.biyaherongchesscoach.com/studentwebsolution/project-1.webp',
                'category' => 'Business System',
                'technologies' => ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
            ],
            [
                'title' => 'Inventory Management System',
                'slug' => 'inventory-management-system',
                'description' => 'Track stock levels, manage suppliers, and generate purchase orders with ease. Features low-stock alerts, product categorization, and detailed inventory reports. Ideal for small to medium businesses.',
                'price' => 599.00,
                'demo_url' => 'https://iptt.laravel.cloud/',
                'thumbnail' => 'https://media.biyaherongchesscoach.com/studentwebsolution/project-2.webp',
                'category' => 'Business System',
                'technologies' => ['Laravel', 'MySQL', 'Tailwind CSS', 'Alpine.js'],
            ],
            [
                'title' => 'Online Enrollment System',
                'slug' => 'online-enrollment-system',
                'description' => 'A web-based enrollment system for schools and universities. Students can register online, select subjects, and view their enrollment status. Admins manage sections, subjects, and student records.',
                'price' => 499.00,
                'demo_url' => 'https://sjamartialarts.com/',
                'thumbnail' => 'https://media.biyaherongchesscoach.com/studentwebsolution/project-3.webp',
                'category' => 'School System',
                'technologies' => ['PHP', 'MySQL', 'Bootstrap', 'jQuery'],
            ],
            [
                'title' => 'Barangay Management System',
                'slug' => 'barangay-management-system',
                'description' => 'Digitize barangay operations — manage residents, issue clearances, record incidents, and generate blotter reports. Designed specifically for Philippine local government units.',
                'price' => 599.00,
                'demo_url' => 'https://doublebishopchess.com/',
                'thumbnail' => 'https://media.biyaherongchesscoach.com/studentwebsolution/project-4.webp',
                'category' => 'Government System',
                'technologies' => ['Laravel', 'MySQL', 'Tailwind CSS', 'Livewire'],
            ],
            [
                'title' => 'Library Management System',
                'slug' => 'library-management-system',
                'description' => 'Manage book collections, track borrowing and returns, and handle overdue fines. Includes a catalog search, member management, and reporting features for school and public libraries.',
                'price' => 499.00,
                'demo_url' => 'https://choros-plus-main-2s4qrk.laravel.cloud/',
                'thumbnail' => 'https://media.biyaherongchesscoach.com/studentwebsolution/project-5.webp',
                'category' => 'School System',
                'technologies' => ['PHP', 'MySQL', 'Bootstrap', 'DataTables'],
            ],
            [
                'title' => 'Hotel Reservation System',
                'slug' => 'hotel-reservation-system',
                'description' => 'Online booking system for hotels and lodges. Guests can check room availability, make reservations, and receive email confirmations. Admin manages rooms, bookings, and occupancy reports.',
                'price' => 699.00,
                'demo_url' => 'https://bijou.laravel.cloud/',
                'thumbnail' => 'https://media.biyaherongchesscoach.com/studentwebsolution/project-6.webp',
                'category' => 'Hospitality',
                'technologies' => ['Laravel', 'MySQL', 'Tailwind CSS', 'Vue.js'],
            ],
            [
                'title' => 'Payroll Management System',
                'slug' => 'payroll-management-system',
                'description' => 'Automate employee payroll computation including SSS, PhilHealth, and Pag-IBIG deductions. Generate payslips, track attendance, and produce BIR-compliant reports for Philippine businesses.',
                'price' => 699.00,
                'demo_url' => 'https://bwc.laravel.cloud/',
                'thumbnail' => 'https://media.biyaherongchesscoach.com/studentwebsolution/project-7.webp',
                'category' => 'Business System',
                'technologies' => ['Laravel', 'MySQL', 'Tailwind CSS', 'Alpine.js'],
            ],
            [
                'title' => 'Clinic Management System',
                'slug' => 'clinic-management-system',
                'description' => 'Manage patient records, appointments, prescriptions, and billing in one system. Doctors can update medical records and view patient history. Designed for small clinics and health centers.',
                'price' => 599.00,
                'demo_url' => 'https://butterflysushibars.com',
                'thumbnail' => 'https://media.biyaherongchesscoach.com/studentwebsolution/project-8.webp',
                'category' => 'Healthcare',
                'technologies' => ['Laravel', 'MySQL', 'Tailwind CSS', 'Livewire'],
            ],
        ];

        foreach ($capstones as $capstone) {
            Capstone::create($capstone);
        }
    }
}
