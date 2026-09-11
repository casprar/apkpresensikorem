CREATE OR REPLACE FUNCTION submit_attendance(
    p_session_id UUID,
    p_name TEXT,
    p_class_name TEXT,
    p_gender TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session_status TEXT;
    v_normalized_name TEXT;
    v_inserted_id UUID;
    v_created_at TIMESTAMPTZ;
BEGIN
    -- Validate session exists and get status
    SELECT status INTO v_session_status
    FROM sessions
    WHERE id = p_session_id;

    IF v_session_status IS NULL THEN
        RETURN jsonb_build_object('status', 'SESSION_NOT_FOUND');
    END IF;

    -- Validate session status is 'OPEN'
    IF v_session_status != 'OPEN' THEN
        RETURN jsonb_build_object('status', 'SESSION_CLOSED');
    END IF;

    -- Validate class_name
    IF p_class_name NOT IN ('Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12') THEN
        RETURN jsonb_build_object('status', 'INVALID_CLASS');
    END IF;

    -- Validate gender
    IF p_gender NOT IN ('MALE', 'FEMALE') THEN
        RETURN jsonb_build_object('status', 'INVALID_GENDER');
    END IF;

    -- Trim and validate name
    IF length(trim(p_name)) < 2 THEN
        RETURN jsonb_build_object('status', 'INVALID_NAME');
    END IF;

    -- Compute normalized name
    v_normalized_name := lower(trim(p_name));

    -- Check for duplicate
    IF EXISTS (
        SELECT 1 
        FROM attendance 
        WHERE session_id = p_session_id 
        AND normalized_name = v_normalized_name
    ) THEN
        RETURN jsonb_build_object('status', 'DUPLICATE');
    END IF;

    -- Insert attendance record
    INSERT INTO attendance (session_id, name, normalized_name, class_name, gender)
    VALUES (p_session_id, trim(p_name), v_normalized_name, p_class_name, p_gender)
    RETURNING id, created_at INTO v_inserted_id, v_created_at;

    -- Return SUCCESS
    RETURN jsonb_build_object(
        'status', 'SUCCESS',
        'data', jsonb_build_object(
            'id', v_inserted_id,
            'name', trim(p_name),
            'class_name', p_class_name,
            'gender', p_gender,
            'created_at', v_created_at
        )
    );
END;
$$;

-- Grant EXECUTE to anon and authenticated
GRANT EXECUTE ON FUNCTION submit_attendance(UUID, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION submit_attendance(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- Function to get session for attendance
CREATE OR REPLACE FUNCTION get_session_for_attendance(
    p_session_id UUID
) RETURNS TABLE (
    session_name TEXT,
    session_date DATE,
    session_start_time TIME,
    session_end_time TIME,
    session_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        name,
        date,
        start_time,
        end_time,
        status
    FROM sessions
    WHERE id = p_session_id;
END;
$$;

-- Grant EXECUTE to anon
GRANT EXECUTE ON FUNCTION get_session_for_attendance(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_session_for_attendance(UUID) TO authenticated;
