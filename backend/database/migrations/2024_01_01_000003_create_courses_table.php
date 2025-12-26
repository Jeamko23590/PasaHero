<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description');
            $table->enum('license_type', ['non-pro', 'professional', 'motorcycle']);
            $table->integer('theory_hours');
            $table->integer('practical_hours');
            $table->integer('vr_simulation_hours')->default(0);
            $table->decimal('price', 10, 2);
            $table->integer('validity_days')->default(90);
            $table->boolean('is_active')->default(true);
            $table->json('requirements')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
