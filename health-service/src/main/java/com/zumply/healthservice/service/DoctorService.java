package com.zumply.healthservice.service;
import com.zumply.healthservice.dto.DoctorListDTO;
import com.zumply.healthservice.entity.DoctorSpecialization;
import com.zumply.healthservice.entity.Doctor;
import com.zumply.healthservice.entity.Hospital;
import com.zumply.healthservice.errorhandler.ZumplyErrorCode;
import com.zumply.healthservice.errorhandler.ZumplyException;
import com.zumply.healthservice.repository.DoctorRepository;
import com.zumply.healthservice.repository.DoctorSpecializationRepository;
import com.zumply.healthservice.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private DoctorSpecializationRepository doctorSpecializationRepository;
    @Autowired
    private HospitalRepository hospitalRepository;

    public List<Doctor> createDoctor(Doctor doctor) throws ZumplyException {
        Optional<DoctorSpecialization> doctorSpecialization = doctorSpecializationRepository.findById(doctor.getDoctorSpecialization().getId());
        if (!doctorSpecialization.isPresent()) {
            throw new ZumplyException(ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorCode(), ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorMessage() + doctor.getDoctorSpecialization().getId());
        }

        Set<Hospital> validHospitals = new HashSet<>();
        for (Hospital hospital : doctor.getHospitals()) {
            Optional<Hospital> foundHospital = hospitalRepository.findById(hospital.getHospitalId());
            if (!foundHospital.isPresent()) {
                throw new ZumplyException(ZumplyErrorCode.HOSPITAL_NOT_FOUND.getErrorCode(), ZumplyErrorCode.HOSPITAL_NOT_FOUND.getErrorMessage() + hospital.getHospitalId());
            }
            validHospitals.add(foundHospital.get());
        }

        Optional<Doctor> foundDoctor = Optional.ofNullable(doctorRepository.findByRegistrationNumber(doctor.getRegistrationNumber()));
        if (foundDoctor.isPresent()) {
            throw new ZumplyException(ZumplyErrorCode.DOCTOR_ALREADY_EXISTS.getErrorCode(), ZumplyErrorCode.DOCTOR_ALREADY_EXISTS.getErrorMessage() + doctor.getRegistrationNumber());
        }

        doctor.setDoctorSpecialization(doctorSpecialization.get());
        doctor.setHospitals(validHospitals);
        return Collections.singletonList(doctorRepository.save(doctor));
    }


    public Doctor addDoctor(Doctor doctor) throws ZumplyException {
        if (doctorRepository.findByRegistrationNumber(doctor.getRegistrationNumber())!=null) {
            throw new ZumplyException(ZumplyErrorCode.DOCTOR_ALREADY_EXISTS.getErrorCode(), ZumplyErrorCode.DOCTOR_ALREADY_EXISTS.getErrorMessage() + doctor.getRegistrationNumber());
        }
        if (doctorRepository.findByEmail(doctor.getEmail())!=null) {
            throw new ZumplyException(ZumplyErrorCode.EMAIL_ALREADY_EXISTS.getErrorCode(), ZumplyErrorCode.EMAIL_ALREADY_EXISTS.getErrorMessage() + doctor.getEmail());
        }
        if (doctorRepository.findByMobile(doctor.getMobile())!=null) {
            throw new ZumplyException(ZumplyErrorCode.PHONE_ALREADY_EXISTS.getErrorCode(), ZumplyErrorCode.PHONE_ALREADY_EXISTS.getErrorMessage() + doctor.getMobile());
        }

        Optional<DoctorSpecialization> doctorSpecialization = doctorSpecializationRepository.findById(doctor.getDoctorSpecialization().getId());
        if (!doctorSpecialization.isPresent()) {
            throw new ZumplyException(ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorCode(), ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorMessage() + doctor.getDoctorSpecialization().getId());
        }
        doctor.setDoctorSpecialization(doctorSpecialization.get());
        return doctorRepository.save(doctor);
    }


    public Page<Doctor> getAllDoctors(Integer pageNo, Integer pageSize, String SortBy) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("id"));
        Page<Doctor> pagedResult = doctorRepository.findAll(pageable);
        return pagedResult;
    }

    public Doctor getDoctorById(int id) throws ZumplyException{
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isEmpty()) {
            throw new ZumplyException(ZumplyErrorCode.DOCTOR_NOT_FOUND.getErrorCode(),ZumplyErrorCode.DOCTOR_NOT_FOUND.getErrorMessage() + id );
        }
        return optionalDoctor.get();
    }

    public List<Doctor> getDoctorByDoctorSpecializationName(String specializationName) throws ZumplyException {
        Optional<DoctorSpecialization> category = doctorSpecializationRepository.findBySpecializationName(specializationName);
        if (!category.isPresent()) {
            throw new ZumplyException(ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorCode(), ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorMessage() + specializationName);
        }
        return doctorRepository.findByDoctorSpecialization(category.get());
    }

//    public List<DoctorListDTO> getDoctorsByDoctorSpecializationId(int id) throws ZumplyException {
//        Optional<DoctorSpecialization> doctorSpecialization = doctorSpecializationRepository.findById(id);
//        if (!doctorSpecialization.isPresent()) {
//            throw new ZumplyException(ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorCode(),
//                    ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorMessage() + id);
//        }
//        List<Doctor> doctors = doctorRepository.findByDoctorSpecialization(doctorSpecialization.get());
//        List<DoctorListDTO> doctorListDTOs = new ArrayList<>();
//
//        for (Doctor doctor : doctors) {
//            for (Hospital hospital : doctor.getHospitals()) {
//                DoctorListDTO dto = new DoctorListDTO();
//                dto.setDoctorId((long) doctor.getId());
//                dto.setDoctorName(doctor.getFullName());
//                dto.setHospitalName(hospital.getName());
//                dto.setRating(doctor.getRating());
//                dto.setRegistrationNo(doctor.getRegistrationNumber());
//                dto.setFees(doctor.getFees());
//                doctorListDTOs.add(dto);
//            }
//        }
//
//        return doctorListDTOs;
//        //return doctorRepository.findByDoctorSpecialization(doctorSpecialization.get());
//    }

    public List<Map<String, Object>> getDoctorsByDoctorSpecializationId(int id) throws ZumplyException {
        Optional<DoctorSpecialization> doctorSpecialization = doctorSpecializationRepository.findById(id);
        if (!doctorSpecialization.isPresent()) {
            throw new ZumplyException(ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorCode(),
                    ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorMessage() + id);
        }
        List<Doctor> doctors = doctorRepository.findByDoctorSpecialization(doctorSpecialization.get());
        Map<Long, Map<String, Object>> doctorMap = new LinkedHashMap<>();

        for (Doctor doctor : doctors) {
            Map<String, Object> doctorDetails;
            if (!doctorMap.containsKey(doctor.getId())) {
                doctorDetails = new LinkedHashMap<>();
                doctorDetails.put("id", doctor.getId());
                doctorDetails.put("fullName", doctor.getFullName());
                doctorDetails.put("rating", doctor.getRating());
                doctorDetails.put("registrationNumber", doctor.getRegistrationNumber());
                doctorDetails.put("fees", doctor.getFees());
                doctorDetails.put("hospitals", new ArrayList<Map<String, Object>>());
                doctorMap.put((long) doctor.getId(), doctorDetails);
            } else {
                doctorDetails = doctorMap.get(doctor.getId());
            }

            List<Map<String, Object>> hospitals = (List<Map<String, Object>>) doctorDetails.get("hospitals");
            for (Hospital hospital : doctor.getHospitals()) {
                Map<String, Object> hospitalMap = new LinkedHashMap<>();
//                hospitalMap.put("id", hospital.getHospitalId());
                hospitalMap.put("hospitalName", hospital.getName());
                hospitalMap.put("hospitalAddress", hospital.getAddress());
                hospitals.add(hospitalMap);
            }
        }

        return new ArrayList<>(doctorMap.values());
    }




    public List<DoctorListDTO> getDoctorsWithHospitals() {
        List<Doctor> doctors = doctorRepository.findAll();
        List<DoctorListDTO> doctorHospitalDTOs = new ArrayList<>();
        for (Doctor doctor : doctors) {
            for (Hospital hospital : doctor.getHospitals()) {
                DoctorListDTO dto = new DoctorListDTO();
                dto.setDoctorId((long)doctor.getId());
                dto.setDoctorName(doctor.getFullName());
                dto.setHospitalName(hospital.getName());
                dto.setRating(doctor.getRating());
                dto.setRegistrationNo(doctor.getRegistrationNumber());
                doctorHospitalDTOs.add(dto);
            }
        }
        return doctorHospitalDTOs;
    }

    public Doctor updateDoctor(int id, Doctor doctor) throws ZumplyException {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (!optionalDoctor.isPresent()) {
            throw new ZumplyException(ZumplyErrorCode.DOCTOR_NOT_FOUND.getErrorCode(), ZumplyErrorCode.DOCTOR_NOT_FOUND.getErrorMessage() + id);
        }

        Doctor existingDoctor = optionalDoctor.get();
        existingDoctor.setFullName(doctor.getFullName());
        existingDoctor.setEmail(doctor.getEmail());
        existingDoctor.setMobile(doctor.getMobile());
        existingDoctor.setGender(doctor.getGender());
        existingDoctor.setRating(doctor.getRating());
        existingDoctor.setCreatedDate(doctor.getCreatedDate());
        existingDoctor.setCreatedBy(doctor.getCreatedBy());
        existingDoctor.setLastModifiedDate(doctor.getLastModifiedDate());
        existingDoctor.setLastModifiedBy(doctor.getLastModifiedBy());

        existingDoctor.setDoctorSpecialization(doctor.getDoctorSpecialization());
        Optional<DoctorSpecialization> doctorSpecialization = doctorSpecializationRepository.findById(existingDoctor.getDoctorSpecialization().getId());
        if (!doctorSpecialization.isPresent()) {
            throw new ZumplyException(ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorCode(), ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorMessage() + existingDoctor.getDoctorSpecialization().getId());
        }
        existingDoctor.setRegistrationNumber(doctor.getRegistrationNumber());
        if (doctorRepository.findByRegistrationNumber(existingDoctor.getRegistrationNumber())!=null) {
            throw new ZumplyException(ZumplyErrorCode.DOCTOR_ALREADY_EXISTS.getErrorCode(), ZumplyErrorCode.DOCTOR_ALREADY_EXISTS.getErrorMessage() + existingDoctor.getRegistrationNumber());
        }
        existingDoctor.setDoctorSpecialization(doctorSpecialization.get());
        return doctorRepository.save(existingDoctor);
    }


    public void deleteDoctor(int id) throws ZumplyException {
        Optional<Doctor> foundDoctor = doctorRepository.findById(id);
        if(foundDoctor.isEmpty()){
            throw new ZumplyException(ZumplyErrorCode.DOCTOR_NOT_FOUND.getErrorCode(),ZumplyErrorCode.DOCTOR_NOT_FOUND.getErrorMessage() + id );
        }
        Doctor doctor = foundDoctor.get();
        doctorRepository.delete(doctor);
    }

    public List<Doctor> getDoctorByCategoryId(int id) throws ZumplyException {
        List<Doctor> doctors = doctorRepository.findDoctorByDoctorSpecializationId(id);
        if (doctors.isEmpty()) {
            throw new ZumplyException(ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorCode(),
                    ZumplyErrorCode.CATEGORY_NOT_FOUND.getErrorMessage() + id);
        }
        return doctors;
    }
}