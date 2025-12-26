<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->string('enrollment_number')->unique();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->date('enrollment_date');
            $table->date('expiry_date');
            $table->enum('status', ['active', 'completed', 'expired', 'cancelled'])->default('active');
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->decimal('balance', 10, 2);
            $table->enum('payment_status', ['pending', 'partial', 'paid'])->default('pending');
            $table->integer('theory_hours_completed')->default(0);
            $table->integer('practical_hours_completed')->default(0);
            $table->integer('vr_hours_completed')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
