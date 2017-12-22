@extends('recovery.layout')

@section('content')
    @forelse($keys as $key)
        <div>Secret key: <b>{{ $key }}</b></div>
    @empty
        <span>Invalid password.</span>
        <a href="{{ url('recovery') }}">Retry</a>
    @endforelse
@endsection