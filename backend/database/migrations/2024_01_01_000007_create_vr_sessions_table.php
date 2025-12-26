<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vr_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained()->onDelete('cascade');
            $table->string('scenario_id');
            $table->string('scenario_name');
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced']);
            $table->integer('duration_minutes');
            $table->json('performance_metrics'); // reaction_time, lane_discipline, speed_control, etc.
            $table->integer('score')->nullable();
            $table->boolean('passed')->default(false);
            $table->json('incidents')->nullable(); // collisions, violations, etc.
            $table->text('ai_feedback')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vr_sessions');
    }
};
