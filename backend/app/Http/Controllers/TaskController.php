<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Events\TaskCreated;
use App\Events\TaskUpdated;
use App\Events\TaskDeleted;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = Task::with('user:id,name,email')->latest()->get();
        return response()->json($tasks);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in-progress,done'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
            'created_by' => auth()->id()
        ]);

        $task->load('user:id,name,email');
        event(new TaskCreated($task));

        return response()->json($task, 201);
    }

    public function show(Task $task): JsonResponse
    {
        $task->load('user:id,name,email');
        return response()->json($task);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,in-progress,done'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task->update($request->only(['title', 'description', 'status']));
        $task->load('user:id,name,email');
        event(new TaskUpdated($task));

        return response()->json($task);
    }

    public function destroy(Task $task): JsonResponse
    {
        event(new TaskDeleted($task, auth()->id()));
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
