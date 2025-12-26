<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instructors', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('license_number');
            $table->date('license_expiry');
            $table->json('specializations'); // ['manual', 'automatic', 'motorcycle', 'vr_certified']
            $table->enum('status', ['active', 'on_leave', 'inactive'])->default('active');
            $table->decimal('hourly_rate', 10, 2);
            $table->integer('max_daily_hours')->default(8);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instructors');
    }
};
