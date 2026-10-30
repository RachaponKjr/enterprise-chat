
use futures_util::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = async_nats::connect(
        "127.0.0.1:4222"
    ).await?;

    println!("Rust connected to NATS");

    let mut subscriber = client
        .subscribe("chat.message.created")
        .await?;

    while let Some(message) = subscriber.next().await {
        let payload = String::from_utf8_lossy(
            &message.payload
        );

        println!("Received event: {}", payload);
    }

    Ok(())
}
