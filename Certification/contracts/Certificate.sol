// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Certificate {
    struct CertificateData {
        string name;
        string course;
        string grade;
        uint256 issueDate;
        uint256 certificateId; // Unique identifier for each certificate
    }

    // Mapping from certificate ID to certificate data
    mapping(uint256 => CertificateData) public certificates;
    // Mapping to track certificates issued to each address
    mapping(address => uint256[]) public certificatesByAddress;
    uint256 public certificateCount; // Counter for unique certificate IDs

    event CertificateIssued(
        address indexed student,
        uint256 certificateId,
        string name,
        string course,
        string grade,
        uint256 issueDate
    );

    function issueCertificate(string memory name, string memory course, string memory grade) public returns (uint256) {
        certificateCount++; // Increment the unique ID
        uint256 newCertificateId = certificateCount;

        certificates[newCertificateId] = CertificateData(name, course, grade, block.timestamp, newCertificateId);
        certificatesByAddress[msg.sender].push(newCertificateId);

        emit CertificateIssued(msg.sender, newCertificateId, name, course, grade, block.timestamp);
        return newCertificateId; // Return the certificate ID
    }

    function getCertificate(uint256 certificateId) public view returns (CertificateData memory) {
        return certificates[certificateId];
    }

    function getCertificatesByAddress(address student) public view returns (uint256[] memory) {
        return certificatesByAddress[student];
    }
}