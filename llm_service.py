"""Flexible evidence-grounded LLM gateway.

Production design:
- Public browser never receives the LLM key or service-role secret.
- The Python backend receives the credentials from environment variables.
- The provider can be a hosted API (`LLM_PROVIDER=openai` or `openai_compatible`)
  or a local GGUF (`LLM_PROVIDER=local`).
- If the provider fails, return a deterministic grounded answer without inventing facts.
"""
import os
import json
from pathlib import Path
from typing import Optional

MODEL_PATH = Path(os.getenv(
    "PRAGATI_LLM_MODEL",
    r"D:\voice interview analyzer\The Startup\models\qwen2.5-7b-instruct-q4_k_m.gguf",
))
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "local").strip().lower()
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen2.5-7b-instruct")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "")
LLM_TIMEOUT_SECONDS = float(os.getenv("LLM_TIMEOUT_SECONDS", "20"))
_model = None


def _deterministic_grounded_fallback(question: str, facts: str) -> str:
    """Always return a grounded summary instead of inventing unsupported material."""
    return (
        "I can answer only from the verified facts already supplied to this service. "
        "Any unsupported detail must be reviewed by an officer before publication.\n\n"
        f"Question: {question}\n\nVerified facts:\n{facts}"
    )


def _call_openai_compatible(question: str, facts: str) -> Optional[str]:
    provider = LLM_PROVIDER
    base_url = LLM_BASE_URL.strip()
    api_key = LLM_API_KEY.strip()
    if provider not in {"openai", "openai_compatible", "remote"} or not api_key:
        return None

    try:
        import requests  # type: ignore
    except Exception:
        return None

    prompt = (
        "You are PRAGATI, an evidence-grounded infrastructure analyst. "
        "Rewrite the supplied verified facts into a concise answer to the question. "
        "Do not add facts, probabilities, causes, monetary calculations, or decisions. "
        "Say when the facts are insufficient.\n\n"
        f"Question: {question}\nVerified facts:\n{facts}"
    )

    url = base_url or "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
        "max_tokens": 220,
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=LLM_TIMEOUT_SECONDS)
        if response.status_code != 200:
            return None
        body = response.json()
        if "choices" in body:
            text = body["choices"][0].get("message", {}).get("content") or body["choices"][0].get("text") or ""
            return text.strip() or None
        if "output" in body:
            return str(body.get("output", "")).strip() or None
    except Exception:
        return None

    return None


def generate_grounded_answer(question: str, facts: str) -> Optional[str]:
    """Return an evidence-grounded answer from a flexible provider stack.

    Order:
    1. Hosted provider if configured via LLM_PROVIDER and LLM_API_KEY.
    2. Local GGUF if configured by PRAGATI_LLM_MODEL and llama_cpp is installed.
    3. Deterministic grounded fallback text.
    """
    global _model

    hosted = _call_openai_compatible(question, facts)
    if hosted:
        return hosted

    provider = LLM_PROVIDER.strip().lower()
    if provider == "local":
        try:
            from llama_cpp import Llama  # type: ignore
            if _model is None:
                if not MODEL_PATH.exists():
                    return _deterministic_grounded_fallback(question, facts)
                _model = Llama(model_path=str(MODEL_PATH), n_ctx=4096, verbose=False)
            prompt = (
                "You are PRAGATI, an evidence-grounded infrastructure analyst. "
                "Rewrite the supplied verified facts into a concise answer to the question. "
                "Do not add facts, probabilities, causes, monetary calculations, or decisions. "
                "Say when the facts are insufficient.\n\n"
                f"Question: {question}\nVerified facts:\n{facts}"
            )
            # Keep the route deterministic for a real deployment by not emitting hallucinated facts.
            result = _model(prompt, max_tokens=220, temperature=0.1, stop=["\n\n"])
            text = result["choices"][0]["text"].strip()
            return text or _deterministic_grounded_fallback(question, facts)
        except Exception:
            return _deterministic_grounded_fallback(question, facts)

    return _deterministic_grounded_fallback(question, facts)
