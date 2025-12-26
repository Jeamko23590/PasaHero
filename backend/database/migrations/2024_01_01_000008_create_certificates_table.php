<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->foreignId('enrollment_id')->constrained()->onDelete('cascade');
            $table->date('issue_date');
            $table->date('expiry_date');
            $table->enum('type', ['completion', 'theory_exam', 'practical_exam', 'lto_ready']);
            $table->string('qr_code')->nullable();
            $table->string('verification_url')->nullable();
            $table->boolean('is_valid')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
