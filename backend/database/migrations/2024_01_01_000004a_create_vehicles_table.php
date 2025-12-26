<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('plate_number')->unique();
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->enum('transmission', ['manual', 'automatic']);
            $table->enum('type', ['sedan', 'suv', 'motorcycle', 'truck']);
            $table->enum('status', ['available', 'in_use', 'maintenance', 'retired'])->default('available');
            $table->date('registration_expiry');
            $table->date('insurance_expiry');
            $table->date('last_maintenance')->nullable();
            $table->date('next_maintenance')->nullable();
            $table->integer('mileage')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
