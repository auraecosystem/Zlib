const std = @import("std");

pub fn build(b: *std.Build) void {
    // === Main Executable ===
    const exe = b.addExecutable(.{
        .name = "jssg",
        .root_source_file = .{ .path = "src/main.zig" },
    });
    exe.setBuildMode(b.standardReleaseOptions());
    exe.linkSystemLibrary("c");
    b.installArtifact(exe);

    // Run step for main executable
    const run_cmd = b.addRunArtifact(exe);
    b.default_step.dependOn(&run_cmd.step);

    // === Plugin Executable Example ===
    const plugin = b.addExecutable(.{
        .name = "jssg-plugin",
        .root_source_file = .{ .path = "src/plugin.zig" },
    });
    plugin.setBuildMode(b.standardReleaseOptions());
    b.installArtifact(plugin);

    // Run step for plugin
    const run_plugin = b.addRunArtifact(plugin);
    b.step("run-plugin", "Run the jssg plugin").dependOn(&run_plugin.step);

    // === Additional Utility Executable ===
    const util = b.addExecutable(.{
        .name = "jssg-util",
        .root_source_file = .{ .path = "src/util.zig" },
    });
    util.setBuildMode(b.standardReleaseOptions());
    b.installArtifact(util);

    // Run step for utility
    const run_util = b.addRunArtifact(util);
    b.step("run-util", "Run the jssg utility").dependOn(&run_util.step);

    // === Tests ===
    const tests = b.addTest(.{
        .root_source_file = .{ .path = "src/test.zig" },
    });
    b.installArtifact(tests);

    // === Optional Formatting Step ===
    const fmt_step = b.addSystemCommand(&[_][]const u8{"zig", "fmt", "src"});
    b.step("format", "Format source code").dependOn(&fmt_step.step);
}

