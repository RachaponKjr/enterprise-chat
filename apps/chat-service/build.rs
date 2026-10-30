fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_prost_build::configure()
        .build_server(false)
        .compile_protos(
            &["../../packages/proto/auth.proto"],
            &["../../packages/proto"],
        )?;

    Ok(())
}