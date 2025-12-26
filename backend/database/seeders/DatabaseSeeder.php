<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Instructor;
use App\Models\Vehicle;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@pasahero.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);
        // Courses
        Course::insert([
            [
                'code' => 'TDC-PDC-NP',
                'name' => 'TDC + PDC Non-Professional',
                'description' => 'Complete theoretical and practical driving course for non-professional license',
                'license_type' => 'non-pro',
                'theory_hours' => 15,
                'practical_hours' => 8,
                'vr_simulation_hours' => 2,
                'price' => 5500.00,
                'validity_days' => 90,
                'is_active' => true,
                'requirements' => json_encode(['Valid ID', 'Birth Certificate', 'Medical Certificate']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'PDC-PRO',
                'name' => 'Professional Driver Course',
                'description' => 'Comprehensive course for professional driver license',
                'license_type' => 'professional',
                'theory_hours' => 20,
                'practical_hours' => 15,
                'vr_simulation_hours' => 5,
                'price' => 8500.00,
                'validity_days' => 120,
                'is_active' => true,
                'requirements' => json_encode(['Valid ID', 'Non-Pro License', 'Medical Certificate', 'Drug Test']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'MC-BASIC',
                'name' => 'Motorcycle Course',
                'description' => 'Basic motorcycle riding course',
                'license_type' => 'motorcycle',
                'theory_hours' => 8,
                'practical_hours' => 5,
                'vr_simulation_hours' => 2,
                'price' => 3500.00,
                'validity_days' => 60,
                'is_active' => true,
                'requirements' => json_encode(['Valid ID', 'Birth Certificate']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Instructors
        Instructor::insert([
            [
                'employee_id' => 'INS-001',
                'first_name' => 'Mark',
                'last_name' => 'Santos',
                'email' => 'mark.santos@pasahero.com',
                'phone' => '09171234567',
                'license_number' => 'N01-12-345678',
                'license_expiry' => '2026-12-31',
                'specializations' => json_encode(['manual', 'automatic']),
                'status' => 'active',
                'hourly_rate' => 350.00,
                'max_daily_hours' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'employee_id' => 'INS-002',
                'first_name' => 'Ana',
                'last_name' => 'Reyes',
                'email' => 'ana.reyes@pasahero.com',
                'phone' => '09181234567',
                'license_number' => 'N01-12-345679',
                'license_expiry' => '2026-06-30',
                'specializations' => json_encode(['theory', 'vr_certified']),
                'status' => 'active',
                'hourly_rate' => 400.00,
                'max_daily_hours' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'employee_id' => 'INS-003',
                'first_name' => 'Jose',
                'last_name' => 'Cruz',
                'email' => 'jose.cruz@pasahero.com',
                'phone' => '09191234567',
                'license_number' => 'N01-12-345680',
                'license_expiry' => '2025-12-31',
                'specializations' => json_encode(['manual', 'motorcycle', 'vr_certified']),
                'status' => 'active',
                'hourly_rate' => 380.00,
                'max_daily_hours' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Vehicles
        Vehicle::insert([
            [
                'plate_number' => 'ABC-123',
                'make' => 'Toyota',
                'model' => 'Vios',
                'year' => 2022,
                'transmission' => 'manual',
                'type' => 'sedan',
                'status' => 'available',
                'registration_expiry' => '2025-06-30',
                'insurance_expiry' => '2025-06-30',
                'mileage' => 25000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plate_number' => 'XYZ-789',
                'make' => 'Honda',
                'model' => 'City',
                'year' => 2023,
                'transmission' => 'automatic',
                'type' => 'sedan',
                'status' => 'available',
                'registration_expiry' => '2025-12-31',
                'insurance_expiry' => '2025-12-31',
                'mileage' => 15000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plate_number' => 'MOT-001',
                'make' => 'Yamaha',
                'model' => 'Mio',
                'year' => 2023,
                'transmission' => 'automatic',
                'type' => 'motorcycle',
                'status' => 'available',
                'registration_expiry' => '2025-12-31',
                'insurance_expiry' => '2025-12-31',
                'mileage' => 5000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Create Instructor Users
        $instructors = Instructor::all();
        foreach ($instructors as $instructor) {
            User::create([
                'name' => $instructor->first_name . ' ' . $instructor->last_name,
                'email' => $instructor->email,
                'password' => Hash::make('password'),
                'role' => 'instructor',
                'instructor_id' => $instructor->id,
                'is_active' => true,
            ]);
        }

        // Sample Students with Users
        $studentsData = [
            ['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'email' => 'juan@email.com', 'phone' => '09171234567'],
            ['first_name' => 'Maria', 'last_name' => 'Garcia', 'email' => 'maria@email.com', 'phone' => '09181234567'],
            ['first_name' => 'Pedro', 'last_name' => 'Reyes', 'email' => 'pedro@email.com', 'phone' => '09191234567'],
        ];

        foreach ($studentsData as $i => $data) {
            $student = Student::create([
                'student_id' => 'STU-2024-' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'birth_date' => '2000-01-15',
                'address' => 'Manila, Philippines',
                'license_type' => 'non-pro',
                'status' => 'enrolled',
            ]);

            User::create([
                'name' => $data['first_name'] . ' ' . $data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'student',
                'student_id' => $student->id,
                'is_active' => true,
            ]);
        }
    }
}
