<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained()->onDelete('cascade');
            $table->foreignId('instructor_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('session_type', ['theory', 'practical', 'vr_simulation', 'exam']);
            $table->date('scheduled_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->integer('rating')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->index(['scheduled_date', 'instructor_id']);
            $table->index(['scheduled_date', 'vehicle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
